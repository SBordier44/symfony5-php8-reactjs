<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Core\Annotation\ApiFilter;
use ApiPlatform\Core\Annotation\ApiResource;
use ApiPlatform\Core\Bridge\Doctrine\Orm\Filter\OrderFilter;
use App\Repository\InvoiceRepository;
use DateTimeInterface;
use Doctrine\ORM\Mapping as ORM;
use JetBrains\PhpStorm\Pure;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints\Choice;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Component\Validator\Constraints\Type;

/**
 * @ORM\Entity(repositoryClass=InvoiceRepository::class)
 */
#[ApiResource(
    itemOperations: [Request::METHOD_GET, Request::METHOD_PUT, Request::METHOD_PATCH, Request::METHOD_DELETE],
    subresourceOperations: ['api_customers_invoices_get_subresource' => ['normalization_context' => ['groups' => ['invoices_read']]]],
    attributes: ['pagination_enabled' => true, 'pagination_items_per_page' => 20, 'order' => ['sentAt' => 'desc']],
    denormalizationContext: ['disable_type_enforcement' => true, 'groups' => ['invoices_write']],
    normalizationContext: ['groups' => ['invoices_read']]
)]
#[ApiFilter(OrderFilter::class, properties: ['amount' => 'desc'])]
class Invoice
{
    public const STATUS_SENT = 'SENT';
    public const STATUS_PAID = 'PAID';
    public const STATUS_CANCELED = 'CANCELED';

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource'])]
    private int $id;

    /**
     * @ORM\Column(type="float")
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'invoices_write'])]
    #[NotBlank(message: "Le montant de la facture est obligatoire")]
    #[Type(type: 'numeric', message: "Le format du montant doit être de type numérique")]
    private float $amount;

    /**
     * @ORM\Column(type="datetime")
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'invoices_write'])]
    #[Type(type: DateTimeInterface::class)]
    private DateTimeInterface $sentAt;

    /**
     * @ORM\Column(type="string", length=255)
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'invoices_write'])]
    #[NotBlank(message: "Le statut de la facture est obligatoire")]
    #[Choice(choices: [
        self::STATUS_SENT,
        self::STATUS_PAID,
        self::STATUS_CANCELED
    ], message: "Le statut de la facture est incorrect")]
    private string $status;

    /**
     * @ORM\Column(type="integer")
     */
    #[Groups(['invoices_read', 'customers_read', 'invoices_subresource', 'invoices_write'])]
    #[NotBlank(message: "Le numéro de la facture est obligatoire")]
    #[Type(type: 'integer', message: "Le numéro de la facture doit être un nombre entier")]
    private int $chrono;

    /**
     * @ORM\ManyToOne(targetEntity=Customer::class, inversedBy="invoices")
     * @ORM\JoinColumn(nullable=false)
     */
    #[Groups(['invoices_read', 'invoices_write'])]
    #[NotBlank(message: "Le client de la facture est obligatoire")]
    private Customer $customer;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAmount(): ?float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;

        return $this;
    }

    public function getSentAt(): ?DateTimeInterface
    {
        return $this->sentAt;
    }

    public function setSentAt(DateTimeInterface $sentAt): self
    {
        $this->sentAt = $sentAt;

        return $this;
    }

    public function getStatus(): ?string
    {
        return $this->status;
    }

    public function setStatus(string $status): self
    {
        $this->status = $status;

        return $this;
    }

    public function getChrono(): ?int
    {
        return $this->chrono;
    }

    public function setChrono(int $chrono): self
    {
        $this->chrono = $chrono;

        return $this;
    }

    public function getCustomer(): ?Customer
    {
        return $this->customer;
    }

    public function setCustomer(Customer $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    #[Pure]
    #[Groups(['invoices_read', 'invoices_subresource'])]
    public function getUser(): User
    {
        return $this->customer->getOwner();
    }
}
